# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Job',
            fields=[
                ('job_id', models.AutoField(serialize=False, primary_key=True)),
                ('submitted', models.DateTimeField(auto_now_add=True)),
                ('completed', models.DateTimeField(null=True, blank=True)),
                ('max_depth', models.PositiveSmallIntegerField(default=3)),
                ('result_id', models.CharField(max_length=32, null=True)),
                ('email', models.EmailField(max_length=254)),
                ('owner', models.ForeignKey(related_name='jobs', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Result',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('output', jsonfield.fields.JSONField()),
                ('job', models.ForeignKey(related_name='result', to='wordscraper.Job')),
            ],
        ),
        migrations.CreateModel(
            name='Site',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('site_id', models.CharField(max_length=128)),
                ('url', models.URLField()),
                ('job', models.ForeignKey(related_name='sites', to='wordscraper.Job')),
            ],
        ),
        migrations.CreateModel(
            name='Term',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('term_id', models.CharField(max_length=128)),
                ('term', models.TextField()),
                ('extras', jsonfield.fields.JSONField()),
                ('job', models.ForeignKey(related_name='terms', to='wordscraper.Job')),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='term',
            unique_together=set([('job', 'term_id')]),
        ),
        migrations.AlterUniqueTogether(
            name='site',
            unique_together=set([('job', 'site_id')]),
        ),
    ]
