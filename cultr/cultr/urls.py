from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'cultr.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', 'landing.views.landing', name='landing'),
    url(r'^beta/', 'landing.views.beta_signup', name='beta_signup'),
    url(r'^access/', 'landing.views.beta_access', name='beta_access'),
    url(r'^home/', 'cultr_app.views.home', name='home'),
    url(r'^terms-of-service/', 'cultr_app.views.terms_of_service', name='terms_of_service'),
    url(r'^api/wordscraper/', include('wordscraper.urls')),
    url(r'^wordscraper/', include('wordscraper.urls')),
)
