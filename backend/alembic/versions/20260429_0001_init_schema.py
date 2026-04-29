"""init schema

Revision ID: 20260429_0001
Revises:
Create Date: 2026-04-29 20:10:00
"""

from alembic import op
import sqlalchemy as sa


revision = "20260429_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "stocks",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("symbol", sa.String(length=16), nullable=False),
        sa.Column("company_name", sa.String(length=255), nullable=True),
        sa.Column("sector", sa.String(length=128), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_stocks_symbol", "stocks", ["symbol"], unique=True)

    op.create_table(
        "price_history",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("stock_id", sa.Integer(), sa.ForeignKey("stocks.id", ondelete="CASCADE"), nullable=False),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("open", sa.Float(), nullable=False),
        sa.Column("high", sa.Float(), nullable=False),
        sa.Column("low", sa.Float(), nullable=False),
        sa.Column("close", sa.Float(), nullable=False),
        sa.Column("volume", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.UniqueConstraint("stock_id", "date", name="uq_pricehistory_stock_date"),
    )
    op.create_index("ix_price_history_date", "price_history", ["date"], unique=False)

    op.create_table(
        "news_articles",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("stock_id", sa.Integer(), sa.ForeignKey("stocks.id", ondelete="SET NULL"), nullable=True),
        sa.Column("title", sa.String(length=512), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("source", sa.String(length=128), nullable=True),
        sa.Column("published_at", sa.DateTime(), nullable=False),
        sa.Column("sentiment_label", sa.String(length=16), nullable=True),
        sa.Column("sentiment_score", sa.Float(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_news_articles_published_at", "news_articles", ["published_at"], unique=False)

    op.create_table(
        "daily_sentiment",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("stock_id", sa.Integer(), sa.ForeignKey("stocks.id", ondelete="CASCADE"), nullable=False),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("score", sa.Float(), nullable=False),
        sa.Column("positive_count", sa.Integer(), nullable=False),
        sa.Column("neutral_count", sa.Integer(), nullable=False),
        sa.Column("negative_count", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.UniqueConstraint("stock_id", "date", name="uq_sentiment_stock_date"),
    )
    op.create_index("ix_daily_sentiment_date", "daily_sentiment", ["date"], unique=False)

    op.create_table(
        "predictions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("stock_id", sa.Integer(), sa.ForeignKey("stocks.id", ondelete="CASCADE"), nullable=False),
        sa.Column("model_name", sa.String(length=64), nullable=False),
        sa.Column("model_version", sa.String(length=64), nullable=False),
        sa.Column("signal", sa.String(length=8), nullable=False),
        sa.Column("confidence", sa.Float(), nullable=False),
        sa.Column("explanation", sa.Text(), nullable=True),
        sa.Column("predicted_for", sa.Date(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )

    op.create_table(
        "portfolio_items",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("symbol", sa.String(length=16), nullable=False),
        sa.Column("company_name", sa.String(length=255), nullable=True),
        sa.Column("added_at", sa.DateTime(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.UniqueConstraint("symbol", name="uq_portfolio_symbol"),
    )
    op.create_index("ix_portfolio_items_symbol", "portfolio_items", ["symbol"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_portfolio_items_symbol", table_name="portfolio_items")
    op.drop_table("portfolio_items")
    op.drop_table("predictions")
    op.drop_index("ix_daily_sentiment_date", table_name="daily_sentiment")
    op.drop_table("daily_sentiment")
    op.drop_index("ix_news_articles_published_at", table_name="news_articles")
    op.drop_table("news_articles")
    op.drop_index("ix_price_history_date", table_name="price_history")
    op.drop_table("price_history")
    op.drop_index("ix_stocks_symbol", table_name="stocks")
    op.drop_table("stocks")
