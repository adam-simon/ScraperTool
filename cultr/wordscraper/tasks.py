from __future__ import absolute_import

from celery import Task, shared_task
from datetime import datetime
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.core.urlresolvers import reverse
from django.template.loader import render_to_string
from wordscraper.models import Job, Term, Site, Result
from wordscraper.utils import init_controller

import logging
import uuid

logger = logging.getLogger(__name__)


class SendResultBaseTask(Task):
    """
    Base task class for sending result emails to job owners.
    """
    abstract = True

    def on_failure(self, exc, task_id, args, kwargs, einfo):
        logger.error("Failed to send result email for job %s due to exception: %s\n%s" % (args[0], exc, einfo))

@shared_task(base=SendResultBaseTask)
def SendResultTask(job_id):
    """
    Send email to owner of the job specified by the job_id with a link to
    download the results.
    TODO: Generate the link and insert in place of cultrtoolkit.com
    """
    job = Job.objects.get(pk=job_id)
    owner = job.owner
    msg_plain = render_to_string('wordscraper/email.txt',
            {'first_name': owner.first_name, 'last_name': owner.last_name,
            'result_id': job.result_id})
    msg_html = render_to_string('wordscraper/email.html',
            {'first_name': owner.first_name, 'last_name': owner.last_name,
            'result_id': job.result_id})
    send_mail('Your CULTR web scraper results', msg_plain, 'no-reply@cultrtoolkit.com',
            [job.email], html_message=msg_html, fail_silently=False)
    logger.info("Sent result email to owner of job %d." % job_id)


class WebscraperBaseTask(Task):
    """
    Base web scraper task defines success and failure behavior.
    """
    abstract = True

    def on_success(self, retval, task_id, args, kwargs):
        logger.debug(args)
        try:
            job = Job.objects.get(pk=args[0])
            job.completed = datetime.now()
            job.result_id = uuid.uuid4().hex
            job.save()
            logger.debug("Scraping job %d completed." % args[0])
            SendResultTask.delay(args[0])
        except Job.DoesNotExist as e:
            logger.exception("Completed job %d not found." % args[0])

    def on_failure(self, exc, task_id, args, kwargs, einfo):
        logger.error("Job %d failed with exception: %s\n%s" % (args[0], exc, einfo))

@shared_task(base=WebscraperBaseTask)
def WebscraperTask(job_id):
    """
    Celery task spawns process to perform scraping job.
    """
    logger.debug("Entering dispatch_wordscraper with job ID: %s" % str(job_id))

    # Obtain all required crawler arguments
    job = Job.objects.get(pk=job_id)
    word_list = [(term.term_id, term.term)
            for term in Term.objects.filter(job=job)]
    site_list = [(site.site_id, site.url, job.max_depth, 'English')
            for site in Site.objects.filter(job=job)]

    # Initialize the crawling process
    logger.debug("Configuring crawl controller with job_id: " +
            "%d, terms: %s, sites: %s" % (job_id, str(word_list),
            str(site_list),))
    controller = init_controller()
    controller.crawl(job_id, site_list, word_list)
    logger.debug("Crawl complete for job: %d" % job_id)

    # Cache the results in the database so the results are dated as close to the
    # crawl date as possible.
    results = controller.query(site_list, word_list)
    result_cache = Result()
    result_cache.job = job
    result_cache.output = results
    result_cache.save()
