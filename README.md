# Streaming (or polling) log files to a UI

Trying to replicate the way Jenkins "streams" logs into its console UI

### Requirements:

- Python 3.6+
- `fabric`
- `Flask`

```bash
$ pip install -r requirements.txt
```

### Setup

copy create a config file: `config/app.conf`:

```bash
PEM_FILE="/absolute/path/to/pem/file"
REMOTE_USER="user"
```

- `PEM_FILE` - location of the `.pem` file
- `REMOTE_USER` - the remote server's user

### Running the app

```bash
$ python app.py
#  * Serving Flask app 'app' (lazy loading)
#  * Environment: production
#    WARNING: This is a development server. Do not use it in a production deployment.
#    Use a production WSGI server instead.
#  * Debug mode: on
#  * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
#  * Restarting with stat
#  * Debugger is active!
#  * Debugger PIN: 104-722-625
```

Open `http://localhost:5000` in your browser, add the values to `Host` and `File Location` and click the button to start "streaming" logs
