TEST_USERNAME = 'test_user'

# Multiple terms, sites, and extra columns
TEST_DATA_OK_0 = {
        "terms":[
            {"term_id": "1","term":"one","extras":[
                {"column A": "value A"},
                {"column B": "value B"}
                ]
            },
            {"term_id": "2","term":"two","extras":[
                {"column A": "value A"},
                {"column B": "value B"}
                ]
            }
        ],
        "sites":[
            {"site_id": "1","url":"http://www.one.com/"},
            {"site_id": "2","url":"http://www.two.com/"}
        ],
        "max_depth": 3
    }

# No extra columns
TEST_DATA_OK_1 = {
        "terms":[
            {"term_id": "1","term":"one"},
            {"term_id": "2","term":"two"}
        ],
        "sites":[
            {"site_id": "1","url":"http://www.one.com/"},
            {"site_id": "2","url":"http://www.two.com/"}
        ],
        "max_depth": 3
    }

# No terms field provided
TEST_DATA_NO_TERMS_0 = {
        "sites":[
            {"site_id": "1","url":"http://www.one.com/"},
            {"site_id": "2","url":"http://www.two.com/"}
        ],
        "max_depth": 3
    }

# Terms field provided but empty
TEST_DATA_NO_TERMS_1 = {
        "terms":[],
        "sites":[
            {"site_id": "1","url":"http://www.one.com/"},
            {"site_id": "2","url":"http://www.two.com/"}
        ],
        "max_depth": 3
    }

# No sites field provided
TEST_DATA_NO_SITES_0 = {
        "terms":[
            {"term_id": "1","term":"one","extras":[
                {"column A": "value A"},
                {"column B": "value B"}
                ]
            },
            {"term_id": "2","term":"two","extras":[
                {"column A": "value A"},
                {"column B": "value B"}
                ]
            }
        ],
        "max_depth": 3
    }

# Sites field provided by empty
TEST_DATA_NO_SITES_1 = {
        "terms":[
            {"term_id": "1","term":"one","extras":[
                {"column A": "value A"},
                {"column B": "value B"}
                ]
            },
            {"term_id": "2","term":"two","extras":[
                {"column A": "value A"},
                {"column B": "value B"}
                ]
            }
        ],
        "sites":[],
        "max_depth": 3
    }

# No max_depth provided
TEST_DATA_NO_DEPTH_0 = {
        "terms":[
            {"term_id": "1","term":"one","extras":[
                {"column A": "value A"},
                {"column B": "value B"}
                ]
            },
            {"term_id": "2","term":"two","extras":[
                {"column A": "value A"},
                {"column B": "value B"}
                ]
            }
        ],
        "sites":[
            {"site_id": "1","url":"http://www.one.com/"},
            {"site_id": "2","url":"http://www.two.com/"}
        ]
    }

# Read-only fields provided
TEST_DATA_READ_ONLY = {
    "job_id": 1337,
    "owner": "somebody",
    "submitted": "2015-05-14T22:50:03.068478Z",
    "completed": "2015-05-14T22:50:03.068478Z",
    "max_depth": 3,
    "terms": [
        {
            "term_id": "1",
            "term": "one",
            "extras": []
        },
        {
            "term_id": "2",
            "term": "two",
            "extras": []
        }
    ],
    "sites": [
        {
            "site_id": "1",
            "url": "http://www.one.com/"
        },
        {
            "site_id": "2",
            "url": "http://www.two.com/"
        }
    ]
}
