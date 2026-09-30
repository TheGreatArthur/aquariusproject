"""Ajout profil

Revision ID: 5d2e8f1a9c47
Revises: c87c809c03a5
Create Date: 2026-09-30 16:10:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5d2e8f1a9c47'
down_revision = 'c87c809c03a5'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'profil',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('id_poisson', sa.Integer(), nullable=False),
        sa.Column('nom_valide', sa.String(length=100), nullable=True),
        sa.Column('auteur', sa.String(length=100), nullable=True),
        sa.Column('classification', sa.String(length=200), nullable=True),
        sa.Column('uicn', sa.String(length=2), nullable=True),
        sa.Column('presentation', sa.Text(), nullable=False),
        sa.Column('habitat', sa.Text(), nullable=False),
        sa.Column('comportement', sa.Text(), nullable=False),
        sa.Column('repartition', sa.String(length=300), nullable=False),
        sa.Column('pays', sa.JSON(), nullable=False),
        sa.Column('points', sa.JSON(), nullable=False),
        sa.Column('sources', sa.JSON(), nullable=False),
        sa.ForeignKeyConstraint(['id_poisson'], ['poisson.id'], name=op.f('fk_profil_id_poisson_poisson'),
                                ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_profil')),
        sa.UniqueConstraint('id_poisson', name=op.f('uq_profil_id_poisson')),
    )


def downgrade() -> None:
    op.drop_table('profil')
