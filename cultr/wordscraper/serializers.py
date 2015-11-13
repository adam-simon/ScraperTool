from django.contrib.auth.models import User
from rest_framework import serializers
from wordscraper.models import Job, Term, Site
import wordscraper.strings as Messages


class JSONSerializerField(serializers.Field):
    """
    JSONField serializer.
    """
    def to_internal_value(self, data):
        return data

    def to_representation(self, value):
        return value


class ExtraSerializer(serializers.ListField):
    """
    Extra fields serializer.
    """
    child = JSONSerializerField()


class TermSerializer(serializers.ModelSerializer):
    """
    Serializer for Word Scraper job terms.
    """
    extras = ExtraSerializer(required=False)

    class Meta:
        model = Term
        fields = ('term_id', 'term', 'extras')


class SiteSerializer(serializers.ModelSerializer):
    """
    Serializer for Word Scraper job sites.
    """
    class Meta:
        model = Site
        fields = ('site_id', 'url')


class JobBaseSerializer(serializers.ModelSerializer):
    """
    Base serializer for Word Scraper Job model.
    """
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Job
        fields = ('job_id', 'owner', 'submitted', 'completed', 'max_depth', 'email', 'result_id')
        read_only_fields = ('job_id', 'submitted', 'completed', 'result_id')


class JobSerializer(JobBaseSerializer):
    """
    Word Scraper Job serializer with terms and sites.
    """
    terms = TermSerializer(many=True, required=True)
    sites = SiteSerializer(many=True, required=True)

    class Meta:
        model = Job
        fields = ('job_id', 'owner', 'submitted', 'completed', 'email', 'result_id', 'max_depth', 'terms', 'sites')
        read_only_fields = ('job_id', 'submitted', 'completed', 'result_id')

    def create(self, validated_data):
        # Extract term and site data
        terms_data = validated_data.pop('terms')
        sites_data = validated_data.pop('sites')

        # Check that at least one term and site provided
        if len(terms_data) == 0:
            raise serializers.ValidationError(Messages.ERROR_NO_TERMS)
        if len(sites_data) == 0:
            raise serializers.ValidationError(Messages.ERROR_NO_SITES)

        # Create the Job and Term models from the data
        job = Job.objects.create(**validated_data)
        for term_data in terms_data:
            term = Term.objects.create(job=job, **term_data)
        for site_data in sites_data:
            site = Site.objects.create(job=job, **site_data)
        return job
