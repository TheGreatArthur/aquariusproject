from datetime import datetime

from sqlalchemy import MetaData, create_engine, inspect, text
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
        values = {attr.key: getattr(self, attr.key) for attr in self.__mapper__.column_attrs}
        return {k: v.isoformat() if isinstance(v, datetime) else v for k, v in values.items()}




def create_schema(engine) -> list[str]:
    """ Crée les tables manquantes et ajoute aux tables existantes les colonnes facultatives apparues depuis :
    une base locale créée par `make import` n'est pas suivie par Alembic. Renvoie les colonnes ajoutées """
    Base.metadata.create_all(bind=engine)
    inspector = inspect(engine)
    quote = engine.dialect.identifier_preparer.quote
    added = []
    with engine.begin() as connection:
        for table in Base.metadata.sorted_tables:
            existing = {c['name'] for c in inspector.get_columns(table.name)}
            for column in table.columns:
                if column.name not in existing and column.nullable:
                    kind = column.type.compile(dialect=engine.dialect)
                    connection.execute(text(f'ALTER TABLE {quote(table.name)} ADD COLUMN {quote(column.name)} {kind}'))
                    added.append(f'{table.name}.{column.name}')
    return added
