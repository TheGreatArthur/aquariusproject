"""Ajout plante

Revision ID: 9b3e4c7d2a15
Revises: 5d2e8f1a9c47
Create Date: 2026-10-04 18:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9b3e4c7d2a15'
down_revision = '5d2e8f1a9c47'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'plante',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('nom_scientifique', sa.String(length=100), nullable=False),
        sa.Column('nom_commun', sa.String(length=50), nullable=False),
        sa.Column('nom_valide', sa.String(length=100), nullable=True),
        sa.Column('auteur', sa.String(length=100), nullable=True),
        sa.Column('famille', sa.String(length=50), nullable=False),
        sa.Column('ordre', sa.String(length=50), nullable=True),
        sa.Column('type', sa.String(length=20), nullable=False),
        sa.Column('positions', sa.JSON(), nullable=False),
        sa.Column('usages', sa.JSON(), nullable=False),
        sa.Column('difficulte', sa.String(length=20), nullable=False),
        sa.Column('croissance', sa.String(length=20), nullable=False),
        sa.Column('lumiere_mini', sa.String(length=20), nullable=False),
        sa.Column('lumiere_maxi', sa.String(length=20), nullable=False),
        sa.Column('co2', sa.String(length=20), nullable=True),
        sa.Column('ph_mini', sa.Float(), nullable=False),
        sa.Column('ph_maxi', sa.Float(), nullable=False),
        sa.Column('kh_mini', sa.Float(), nullable=True),
        sa.Column('kh_maxi', sa.Float(), nullable=True),
        sa.Column('temp_mini', sa.Integer(), nullable=False),
        sa.Column('temp_maxi', sa.Integer(), nullable=False),
        sa.Column('temp_opti_mini', sa.Integer(), nullable=True),
        sa.Column('temp_opti_maxi', sa.Integer(), nullable=True),
        sa.Column('hauteur_mini', sa.Float(), nullable=True),
        sa.Column('hauteur_maxi', sa.Float(), nullable=True),
        sa.Column('multiplication', sa.JSON(), nullable=False),
        sa.Column('emergee', sa.Boolean(), nullable=True),
        sa.Column('origine', sa.String(length=300), nullable=False),
        sa.Column('presentation', sa.Text(), nullable=False),
        sa.Column('culture', sa.Text(), nullable=False),
        sa.Column('images', sa.JSON(), nullable=False),
        sa.Column('sources', sa.JSON(), nullable=False),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_plante')),
    )
    op.create_index(op.f('ix_plante_nom_scientifique'), 'plante', ['nom_scientifique'], unique=True)
    op.create_index(op.f('ix_plante_nom_commun'), 'plante', ['nom_commun'], unique=False)
    op.create_index(op.f('ix_plante_famille'), 'plante', ['famille'], unique=False)
    op.create_index(op.f('ix_plante_type'), 'plante', ['type'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_plante_type'), table_name='plante')
    op.drop_index(op.f('ix_plante_famille'), table_name='plante')
    op.drop_index(op.f('ix_plante_nom_commun'), table_name='plante')
    op.drop_index(op.f('ix_plante_nom_scientifique'), table_name='plante')
    op.drop_table('plante')
