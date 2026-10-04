"""Ajout invertebre

Revision ID: 7c4d2e9a1b36
Revises: 3f6a1c9e8b27
Create Date: 2026-10-05 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7c4d2e9a1b36'
down_revision = '3f6a1c9e8b27'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'invertebre',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('nom_scientifique', sa.String(length=100), nullable=False),
        sa.Column('nom_commun', sa.String(length=80), nullable=False),
        sa.Column('variete', sa.String(length=50), nullable=True),
        sa.Column('groupe', sa.String(length=20), nullable=False),
        sa.Column('famille', sa.String(length=50), nullable=False),
        sa.Column('genre', sa.String(length=50), nullable=False),
        sa.Column('zone_geo', sa.String(length=30), nullable=True),
        sa.Column('installation', sa.String(length=20), nullable=False),
        sa.Column('milieu', sa.String(length=30), nullable=False),
        sa.Column('ph_mini', sa.Float(), nullable=False),
        sa.Column('ph_maxi', sa.Float(), nullable=False),
        sa.Column('gh_mini', sa.Float(), nullable=True),
        sa.Column('gh_maxi', sa.Float(), nullable=True),
        sa.Column('kh_mini', sa.Float(), nullable=True),
        sa.Column('kh_maxi', sa.Float(), nullable=True),
        sa.Column('temp_mini', sa.Float(), nullable=False),
        sa.Column('temp_maxi', sa.Float(), nullable=False),
        sa.Column('taille', sa.Float(), nullable=True),
        sa.Column('mesure_taille', sa.String(length=60), nullable=True),
        sa.Column('litrage_mini', sa.Integer(), nullable=True),
        sa.Column('nb_individus', sa.Integer(), nullable=True),
        sa.Column('longevite', sa.Integer(), nullable=True),
        sa.Column('comportement', sa.String(length=30), nullable=False),
        sa.Column('mode_vie', sa.String(length=30), nullable=True),
        sa.Column('regime', sa.String(length=30), nullable=True),
        sa.Column('activite', sa.String(length=20), nullable=True),
        sa.Column('reproduction', sa.String(length=60), nullable=True),
        sa.Column('images', sa.JSON(), nullable=False),
        sa.Column('credits', sa.JSON(), nullable=False),
        sa.Column('profil', sa.JSON(), nullable=False),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_invertebre')),
    )
    op.create_index(op.f('ix_invertebre_nom_scientifique'), 'invertebre', ['nom_scientifique'], unique=True)
    op.create_index(op.f('ix_invertebre_nom_commun'), 'invertebre', ['nom_commun'], unique=False)
    op.create_index(op.f('ix_invertebre_groupe'), 'invertebre', ['groupe'], unique=False)
    op.create_index(op.f('ix_invertebre_famille'), 'invertebre', ['famille'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_invertebre_famille'), table_name='invertebre')
    op.drop_index(op.f('ix_invertebre_groupe'), table_name='invertebre')
    op.drop_index(op.f('ix_invertebre_nom_commun'), table_name='invertebre')
    op.drop_index(op.f('ix_invertebre_nom_scientifique'), table_name='invertebre')
    op.drop_table('invertebre')
