"""Ajout credits poisson

Revision ID: 3f6a1c9e8b27
Revises: 9b3e4c7d2a15
Create Date: 2026-10-04 20:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3f6a1c9e8b27'
down_revision = '9b3e4c7d2a15'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('poisson', sa.Column('credits', sa.JSON(), nullable=True))


def downgrade() -> None:
    op.drop_column('poisson', 'credits')
