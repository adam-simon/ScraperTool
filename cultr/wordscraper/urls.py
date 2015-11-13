from django.conf.urls import include, patterns, url
from rest_framework.urlpatterns import format_suffix_patterns
from wordscraper import views

urlpatterns = [
	url(r'^$', views.wordscraper_app, name='wordscraper_app'),
	url(r'^instruction.html', views.instruction_app, name='wordscraper_app'),
	url(r'^upload.html', views.upload_data, name='wordscraper_app'),
	url(r'^map.html', views.map_data, name='wordscraper_app'),
	url(r'^done.html', views.wordscraper_done, name='wordscraper_app'),
	
    url(r'^v1/jobs/$', views.JobList.as_view(), name='wordscraper-job-list'),
    url(r'^v1/jobs/(?P<pk>[0-9]+)/$', views.JobDetail.as_view(), name='wordscraper-job-detail'),
    url(r'^v1/results/(?P<id>[0-9a-f]+)/$', views.job_result, name='wordscraper-job-results'),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]

urlpatterns = format_suffix_patterns(urlpatterns)
