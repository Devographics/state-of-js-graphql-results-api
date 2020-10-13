# StateOfJS API

## Data Format

Here's an example of a sample survey response for the 2020 State of CSS survey:

```js
{
  "_id": "123foobar",
  "surveySlug": "css2020",
  "createdAt": "2020-10-13T21:32:25.571Z",
  "updatedAt": "2020-10-13T21:50:08.693Z",
  "year": 2020,
  "completion": 89,
  "userId": "456barbaz",
  "responseId": "789foobaz",
  "generatedAt": "2020-10-13T21:53:55.219Z",
  "survey": "css",
  "user_info": {
    "device": "desktop",
    "browser": "Chrome",
    "version": "86.0.4240.75",
    "os": "macOS",
    "referrer": "",
    "backend_proficiency": 3,
    "company_size": "range_1",
    "css_proficiency": 4,
    "gender": "male",
    "how_did_user_find_out_about_the_survey": "I made it!",
    "javascript_proficiency": 4,
    "job_title": "full_stack_developer",
    "race_ethnicity": {
      "choices": [
        "white_european"
      ]
    },
    "yearly_salary": "range_10_30",
    "years_of_experience": "range_10_20",
    "country": "JP",
    "email_hash": "63bea61eeda07586ced5fc60400672b2b61b06986445a1de665a827a5456d519",
    "country_name": "Japan",
    "country_alpha3": "JPN"
  },
  "features": {
    "aspect_ratio": {
      "experience": "never_heard"
    },
    "content_visibility": {
      "experience": "never_heard"
    },
    "exclusions": {
      "experience": "never_heard"
    },
    "flexbox": {
      "experience": "used"
    }
  },
  "features_others": {
    "attributes": {
      "choices": [
        "presence",
        "equality"
      ]
    },
    "combinators": {
      "choices": [
        "descendant",
        "child",
        "next_sibling"
      ]
    }
  },
  "happiness": {
    "pre_post_processors": 3,
    "css_frameworks": 3,
    "css_methodologies": 2,
    "css_in_js": 2,
    "state_of_css": 3,
    "state_of_the_web": 3
  },
  "tools": {
    "less": {
      "experience": "not_interested"
    },
    "post_css": {
      "experience": "would_use"
    },
    "sass": {
      "experience": "would_use"
    },
    "stylus": {
      "experience": "not_interested"
    }
  },
  "tools_others": {
    "css_frameworks": {
      "others": {
        "raw": "angular native, react native",
        "normalized": [
          "angular_native",
          "reactnative"
        ],
        "patterns": [
          "/angular( |-)?native/i",
          "/react( |-|_)?native/i"
        ]
      }
    },
    "utilities": {
      "choices": [
        "stylelint",
        "purge_css"
      ],
      "others": {
        "raw": "some other utility",
        "normalized": [],
        "patterns": []
      }
    },
    "text_editors": {
      "others": {
        "raw": "angular native",
        "normalized": [
          "angular_native"
        ],
        "patterns": [
          "/angular( |-)?native/i"
        ]
      }
    }
  },
  "environments": {
    "browsers": {
      "choices": [
        "chrome",
        "safari",
        "firefox",
        "safari_ios"
      ]
    },
    "css_for_email": 1,
    "css_for_print": 0,
    "form_factors": {
      "choices": [
        "desktop",
        "smartphone"
      ]
    }
  },
  "resources": {
    "blogs_news_magazines": {
      "choices": [
        "css_tricks",
        "codrops",
        "sidebar",
        "heydesigner"
      ],
      "others": {
        "raw": "some other blog",
        "normalized": [],
        "patterns": []
      }
    },
    "podcasts": {
      "choices": [
        "shop_talk_show",
        "syntaxfm"
      ]
    },
    "sites_courses": {
      "choices": [
        "stack_overflow",
        "mdn"
      ]
    }
  },
  "opinions": {
    "css_easy_to_learn": 1,
    "css_evolving_slowly": 1,
    "css_is_programming_language": 4,
    "enjoy_writing_css": 2,
    "selector_nesting_to_be_avoided": 3,
    "utility_classes_to_be_avoided": 1
  },
  "opinions_other": {
    "currently_missing_from_css": {
      "others": {
        "raw": "Container queries",
        "normalized": [
          "container_queries"
        ],
        "patterns": [
          "/container ?queries/i"
        ]
      }
    }
  }
}
```
