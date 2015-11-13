# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('wordscraper', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='job',
            name='email',
            field=models.EmailField(max_length=75),
        ),
    ]
