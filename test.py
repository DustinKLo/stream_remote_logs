import sys
import logging
import random
import time

from uuid import uuid4


if __name__ == '__main__':
    FILE_NAME = sys.argv[1] if len(sys.argv) > 1 else '/tmp/test.log'

    logging.basicConfig(
        filename=FILE_NAME,
        filemode='w',
        format="[%(asctime)s: %(levelname)s/%(funcName)s] %(message)s",
        level=logging.INFO
    )

    while True:
        logging.info(str(uuid4()))
        time.sleep(random.uniform(0, 1))
