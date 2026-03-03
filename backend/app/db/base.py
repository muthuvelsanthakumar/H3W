# Import all the models so that Base has them before being
# imported by Alembic
from app.db.base_class import Base  # noqa
from app.models.user import User  # noqa
from app.models.organization import Organization  # noqa
from app.models.data_source import DataSource  # noqa
from app.models.insight import Insight  # noqa
