## Brew

This is our internal webpages for our brews.

The backend is based on Django for authentication, session management and template engine. Django REST Framework is used for serializing and exposing the models.
The frontend is written in AngularJS.

### Development setup

Make a virtual environment

    mkvirtualenv brew

Activate the environment

    source brew/bin/activate

Go to the directory of the repo and install dependencies

    pip3 install -r requirements.txt
