"""
Chat tests
"""
import pytest
import logging
from utils import report
from src.asgi import application
from channels.testing import WebsocketCommunicator

TEST_CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    },
}

logger = logging.getLogger('django')
logger.setLevel(0)

@pytest.mark.asyncio
async def test_my_consumer(settings):
    settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS

    ahmed = WebsocketCommunicator(application, "/ws/viba/user/1g6XMwbM57e9BI1wotNLGwMeSz03")
    karem = WebsocketCommunicator(application, "/ws/viba/chat/1V7YHFV9bBYhRrhu7CHx89YTONj2/a8f6f97a_68d4_4003_bdc7_1b10fe284105")

    ahmed_connected, subprotocol = await ahmed.connect()
    assert ahmed_connected

    karem_connected, subprotocol = await karem.connect()
    assert karem_connected

    # await ahmed.send_json_to({"text": "Hello, I am Ahmed", "uid": "1g6XMwbM57e9BI1wotNLGwMeSz03", "timeSent": "2024-06-26T22:42:38.513Z"})
    # what_karem_got = await karem.receive_json_from(timeout=10)

    # logger.setLevel(10)
    # report(f"[Ahmed] >> {what_karem_got}")
    # logger.setLevel(0)

    await karem.send_json_to({"text": "Hello Ahmed!, I am Karem", "uid": "1V7YHFV9bBYhRrhu7CHx89YTONj2", "timeSent": "2024-06-26T22:42:38.513Z"})
    what_ahmed_got = await ahmed.receive_json_from(timeout=10)

    logger.setLevel(10)
    report(f"[Karem] >> {what_ahmed_got}")
    logger.setLevel(0)

    await ahmed.disconnect()
    await karem.disconnect()
