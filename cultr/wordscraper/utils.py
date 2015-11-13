from django.conf import settings
from cultr_word_scraper import Controller

def format_row(key, results):
    return [key, results[key]['accessed'], results[key]['depth'], results[key]['domain'], results[key]['site_id'], results[key]['status'], results[key]['term_matches']]

def init_controller():
    """
    Obtain the database credentials from Django settings and return an
    initialized crawl controller with the database connection configured.
    """
    db_settings = settings.DATABASES['default']
    db_config = {
        'type': 'Postgres',
        'database': db_settings['NAME'],
        'user': db_settings['USER'],
        'password': db_settings['PASSWORD'],
        'host': db_settings['HOST'],
        'port': db_settings['PORT']
    }
    return Controller(db_config)
