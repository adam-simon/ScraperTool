from django.db import models

class BetaSignUp(models.Model):
    """
    The container model for information of potential beta users.
    """
    name = models.CharField(max_length=64)
    email = models.EmailField()
    twitter_handle = models.CharField(max_length=15, blank=True)
    organization = models.CharField(max_length=256)
    project = models.TextField()
    purpose = models.TextField()
    coauthors = models.TextField(blank=True)

    def __unicode__(self):
        return '%s (%s)' % (self.name, self.email)

class AccessCode(models.Model):
    """
    Access code for granting entry to the Cultr home page.
    """
    code = models.CharField(max_length=32, primary_key=True)
    valid = models.BooleanField(default=True)
