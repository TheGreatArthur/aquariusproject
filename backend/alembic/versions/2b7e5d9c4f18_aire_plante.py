"""Aire de répartition des plantes

Revision ID: 2b7e5d9c4f18
Revises: 7c4d2e9a1b36
Create Date: 2026-10-05 20:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2b7e5d9c4f18'
down_revision = '7c4d2e9a1b36'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('plante', sa.Column('pays', sa.JSON(), nullable=True))
    op.add_column('plante', sa.Column('introduits', sa.JSON(), nullable=True))
    op.add_column('plante', sa.Column('points', sa.JSON(), nullable=True))
    op.add_column('plante', sa.Column('taxon_aire', sa.String(length=100), nullable=True))
    op.add_column('plante', sa.Column('uicn', sa.String(length=2), nullable=True))


def downgrade() -> None:
    op.drop_column('plante', 'uicn')
    op.drop_column('plante', 'taxon_aire')
    op.drop_column('plante', 'points')
    op.drop_column('plante', 'introduits')
    op.drop_column('plante', 'pays')
