import os
import socket
from flask import Flask, request, Response, render_template
from fabric.connection import Connection


app = Flask(__name__)
app.config.from_pyfile(os.path.join(".", "config/app.conf"), silent=False)

REMOTE_USER = app.config['REMOTE_USER']
CONNECT_KWARGS = {
    "key_filename": app.config['PEM_FILE']
}


@app.route('/')
def home():
    return render_template('./index.html', template_folder='templates')


@app.route('/stream', methods=['POST'])
def stream():
    start = int(request.form.get('start', 0))
    host = request.form.get('host', None)
    location = request.form.get('location', None)

    if host is None or location is None:
        return 'host and location must be supplied', 400

    try:
        with Connection(host=host, user=REMOTE_USER,
                        connect_kwargs=CONNECT_KWARGS, connect_timeout=2) as c, \
                c.sftp() as sftp:
            try:
                with sftp.open(location, 'r') as f:
                    f.seek(start)
                    data = f.read()
                    if type(data) == bytes:
                        data = data.decode('utf-8')
                    return Response(data, content_type='text/plain')
            except FileNotFoundError as e:
                return str(e), 404
            except Exception as e:
                return str(e), 500
    except socket.gaierror as e:
        return str(e), 400
    except Exception as e:
        return str(e), 500


@app.route('/stream-local', methods=['POST'])
def stream_local():
    start = int(request.form.get('start', 0))
    location = request.form.get('location', None)

    if location is None:
        return 'location must be supplied', 400

    try:
        with open(location, 'r') as f:
            f.seek(start)
            data = f.read()
            if type(data) == bytes:
                data = data.decode('utf-8')
            return Response(data, content_type='text/plain')
    except FileNotFoundError as e:
        return str(e), 404
    except Exception as e:
        return str(e), 500


if __name__ == '__main__':
    app.run(port=5000, debug=True)
