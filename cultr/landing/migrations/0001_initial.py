# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AccessCode',
            fields=[
                ('code', models.CharField(max_length=32, serialize=False, primary_key=True)),
                ('valid', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='BetaSignUp',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=64)),
                ('email', models.EmailField(max_length=254)),
                ('twitter_handle', models.CharField(max_length=15, blank=True)),
                ('organization', models.CharField(max_length=256)),
                ('project', models.TextField()),
                ('purpose', models.TextField()),
                ('coauthors', models.TextField(blank=True)),
            ],
        ),
    ]
