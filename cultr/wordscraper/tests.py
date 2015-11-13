from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from wordscraper.models import Job, Term
from wordscraper.test_data import *


class JobListTests(APITestCase):
    """
    This set of cases tests the behaviour of the JobList API endpoint.
    """
    def setUp(self):
        """
        Create a test user and force authenticate them. Specify the endpoint URL
        under test.
        """
        user = User.objects.create(username=TEST_USERNAME)
        user.save()
        self.client.force_authenticate(user)
        self.url = reverse('wordscraper-job-list')

    def _authenticate_test_user(self):
        user = User.objects.get(username=TEST_USERNAME)
        self.client.force_authenticate(user)

    def _test_post_status(self, data, status):
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status)

    def test_create_job_success(self):
        """
        Test the creation of two jobs using valid data. Also test retrieval in
        the case of user having no jobs, as well as having both created jobs.
        """
        # Check that no jobs exist in the database
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

        # Check successful creation of two jobs
        self._test_post_status(TEST_DATA_OK_0, status.HTTP_201_CREATED)
        self._test_post_status(TEST_DATA_OK_1, status.HTTP_201_CREATED)

        # Test that both jobs are retrieved
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_create_job_bad_request(self):
        """
        Test various types of malformed input.
        """
        self._test_post_status({}, status.HTTP_400_BAD_REQUEST)
        self._test_post_status(TEST_DATA_NO_TERMS_0, status.HTTP_400_BAD_REQUEST)
        self._test_post_status(TEST_DATA_NO_TERMS_1, status.HTTP_400_BAD_REQUEST)
        self._test_post_status(TEST_DATA_NO_SITES_0, status.HTTP_400_BAD_REQUEST)
        self._test_post_status(TEST_DATA_NO_SITES_1, status.HTTP_400_BAD_REQUEST)

    def test_create_job_default_depth(self):
        """
        Test that not providing a max_depth will properly set the newly created
        job's max_depth to 3.
        """
        response = self.client.post(self.url, TEST_DATA_NO_DEPTH_0, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['max_depth'], 3)

    def test_create_job_received_read_only_fields(self):
        """
        Test that sending any read-only fields (completion date, submission
        date, job_id, owner) still correctly sets them to the appropriate
        values.
        """
        response = self.client.post(self.url, TEST_DATA_READ_ONLY, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertNotEqual(response.data['job_id'], 1337)
        self.assertNotEqual(response.data['owner'], "somebody")
        self.assertNotEqual(response.data['completed'], "2015-05-14T22:50:03.068478Z")


class JobDetailTests(APITestCase):
    """
    This set of cases tests the behaviour of the JobDetail API endpoint.
    """
    def setUp(self):
        """
        Create a test user and force authenticate them. Specify the endpoint URL
        under test.
        """
        user = User.objects.create(username=TEST_USERNAME)
        user.save()
        self.client.force_authenticate(user)
        self.url_str = 'wordscraper-job-detail'

    def _create_test_job(self):
        response = self.client.post(reverse('wordscraper-job-list'), TEST_DATA_OK_0, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        return response.data['job_id']

    def test_get_delete_job(self):
        """
        Create a job and test if it can be retrieved.
        """
        job_id = self._create_test_job()
        response = self.client.get(reverse(self.url_str, args=(job_id,)))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['job_id'], job_id)
        self.assertEqual(len(response.data['terms']), 2)
        response = self.client.delete(reverse(self.url_str, args=(job_id,)))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        terms = Term.objects.filter(job=job_id)
        self.assertEqual(len(terms), 0)

    def test_job_does_not_exist(self):
        """
        Test that requesting a job that does not exist results in a 404.
        """
        response = self.client.get(reverse(self.url_str, args=(1337,)))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
