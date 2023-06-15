from datetime import datetime

from sqlalchemy import MetaData, create_engine
from sqlalchemy.orm import DeclarativeBase

# Recommended naming convention used by Alembic, as various different database
# providers will autogenerate vastly different names making migrations more
# difficult. See: https://alembic.sqlalchemy.org/en/latest/naming.html
NAMING_CONVENTION = {
    'ix': 'ix_%(column_0_label)s',
    'uq': 'uq_%(table_name)s_%(column_0_name)s',
    'ck': 'ck_%(table_name)s_%(constraint_name)s',
    'fk': 'fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s',
    'pk': 'pk_%(table_name)s'
}


def get_engine(DSN):
    return create_engine(DSN)


metadata_obj = MetaData(naming_convention=NAMING_CONVENTION)


class Base(DeclarativeBase):
    """"""
    metadata = metadata_obj

    def __str__(self) -> str:
        """"""
        return f'<{self.__class__.__name__} {self.id}>'

    def __repr__(self) -> str:
        """"""
        return f'<{self.__class__.__name__} {self.id}>'

    def as_dict(self) -> dict:
        """ Conversion en dictionnaire (pour JSON)
        """
        return {k: v.isoformat() if isinstance(v, datetime) else v
                for k, v in self.__dict__.items() if not k.startswith('_')}


