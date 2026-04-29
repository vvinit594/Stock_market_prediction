import { StockHeader } from "@/components/stock/StockHeader";
import { PriceChartCard } from "@/components/stock/PriceChartCard";
import { TechnicalIndicatorsCard } from "@/components/stock/TechnicalIndicatorsCard";
import { SentimentTimelineCard } from "@/components/stock/SentimentTimelineCard";
import { AIPredictionInsightCard } from "@/components/stock/AIPredictionInsightCard";
import { NewsImpactCard } from "@/components/stock/NewsImpactCard";
import { CompanySnapshotCard } from "@/components/stock/CompanySnapshotCard";
import { getStockData } from "@/lib/stock-data";

export interface StockDetailPageProps {
  params: Promise<{ ticker: string }>;
}

export default async function StockDetailPage({ params }: StockDetailPageProps) {
  const { ticker } = await params;
  const data = getStockData(ticker);

  return (
    <div className="space-y-8 pb-8">
      <StockHeader
        companyName={data.companyName}
        ticker={data.ticker}
        price={data.price}
        changePercent={data.changePercent}
        signal={data.signal}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - Primary Analysis */}
        <div className="space-y-6 lg:col-span-2">
          <PriceChartCard />
          <TechnicalIndicatorsCard />
          <SentimentTimelineCard />
        </div>

        {/* Right column - Insights & Context */}
        <div className="space-y-6">
          <AIPredictionInsightCard
            signal={data.signal}
            confidence={data.confidence}
            explanation={data.explanation}
          />
          <NewsImpactCard items={data.news} />
          <CompanySnapshotCard data={data.companySnapshot} />
        </div>
      </div>
    </div>
  );
}
