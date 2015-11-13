from django.contrib.auth.models import User
from django.db import models
from jsonfield import JSONField


MAX_DEPTH_DEFAULT = 3


class Job(models.Model):
    """
    The Job model contains information about created Word Scraper jobs.
    """
    job_id = models.AutoField(primary_key=True)
    owner = models.ForeignKey(User, related_name='jobs')
    submitted = models.DateTimeField(auto_now_add=True)
    completed = models.DateTimeField(blank=True, null=True)
    max_depth = models.PositiveSmallIntegerField(default=MAX_DEPTH_DEFAULT)
    result_id = models.CharField(max_length=32, null=True)
    email = models.EmailField()

    def __unicode__(self):
        return 'job: %d' % (self.job_id)


class Term(models.Model):
    """
    The Term model contains a search term as well as its job-specific ID.
    """
    job = models.ForeignKey('Job', related_name='terms')
    term_id = models.CharField(max_length=128)
    term = models.TextField()
    extras = JSONField()

    class Meta:
        unique_together = ('job', 'term_id')

    def __unicode__(self):
        return 'job: %d, term_id: %s, term: %s' % (self.job.job_id, self.term_id, self.term)


class Site(models.Model):
    """
    The Site model contains a site URL and its job-specific ID.
    """
    job = models.ForeignKey('Job', related_name='sites')
    site_id = models.CharField(max_length=128)
    url = models.URLField()

    class Meta:
        unique_together = ('job', 'site_id')

    def __unicode__(self):
        return 'job: %d, site_id: %s, url: %s' % (self.job.job_id, self.site_id, self.url)


class Result(models.Model):
    """
    Contains the result for a given job, saved immediately after scraping is
    completed.
    """
    job = models.ForeignKey('Job', related_name='result')
    output = JSONField()
