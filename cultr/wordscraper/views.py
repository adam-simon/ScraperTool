#from cultr_word_scraper import Controller
from django.core.exceptions import PermissionDenied
from django.db import transaction
from django.http import Http404, HttpResponse, HttpResponseForbidden
from django.shortcuts import render_to_response
from wordscraper.models import Job, Term, Site, Result
from wordscraper.serializers import JobBaseSerializer, JobSerializer
from wordscraper.tasks import WebscraperTask
from wordscraper.utils import format_row, init_controller
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions, status

import csv
import logging

logger = logging.getLogger(__name__)

def wordscraper_app(request):
    return render_to_response("wordscraper/index.html")
	
def instruction_app(request):
    return render_to_response("wordscraper/instruction.html")

def upload_data(request):
	return render_to_response("wordscraper/upload.html")

def map_data(request):
	return render_to_response("wordscraper/map.html")

def wordscraper_done(request):
	return render_to_response("wordscraper/done.html")


class JobList(APIView):
    """
    List all Word Scraper jobs, or create a new job.
    """
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        jobs = Job.objects.filter(owner=request.user)
        serializer = JobBaseSerializer(jobs, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        """
        Create a job for the authenticated user with the parameters provided.
        """
        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=self.request.user)
            # Dispatch wordscraper for the newly created job
            WebscraperTask.delay(serializer.data['job_id'])
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class JobDetail(APIView):
    """
    Retrieve or delete a Word Scraper job.
    """
    permission_classes = (permissions.IsAuthenticated,)

    def _retrieve(self, user, pk):
        """
        Retrieve the job with the specified primary key and owner. If the job
        does not exist, return a 404 error response.
        """
        try:
            return Job.objects.get(pk=pk, owner=user)
        except Job.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        job = self._retrieve(request.user, pk)
        serializer = JobSerializer(job)
        return Response(serializer.data)

    def delete(self, request, pk, format=None):
        """
        Delete the request job along with all of the job's term objects.
        TODO: Add hooks for cancelling the deleted job
        """
        job = self._retrieve(request.user, pk)

        # Atomically delete all of the job's terms, then delete the job
        with transaction.atomic():
            terms = Term.objects.filter(job=job)
            for term in terms:
                term.delete()
            job.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


def job_result(request, id):
    """
    Retrieve the results of the requested Word Scraper job in a CSV file.
    """
    try:
        job = Job.objects.get(result_id=id)
    except Job.DoesNotExist:
        raise Http404

    word_list = [(term.term_id, term.term)
            for term in Term.objects.filter(job=job)]
    site_list = [(site.site_id, site.url, job.max_depth, 'English')
            for site in Site.objects.filter(job=job)]
    controller = init_controller()
    results = Result.objects.get(job=job).output
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="%s_results.csv"' % job.job_id

    writer = csv.writer(response)
    writer.writerow(['url', 'accessed', 'depth', 'domain', 'site_id', 'status', 'term_matches'])
    for key in sorted(results, key=lambda x: (results[x]['site_id'], results[x]['depth'], x)):
        writer.writerow(format_row(key, results))
    return response
