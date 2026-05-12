from pymongo import MongoClient
from pymongo.errors import PyMongoError
from app.config.settings import settings

client = None
db = None
calls_collection = None

if settings.MONGO_URI:
	try:
		client = MongoClient(settings.MONGO_URI, serverSelectionTimeoutMS=2000)
		db = client[settings.MONGO_DB_NAME]
		calls_collection = db[settings.MONGO_COLLECTION_NAME]
	except PyMongoError:
		client = None
		db = None
		calls_collection = None


def is_mongo_available():
	return calls_collection is not None