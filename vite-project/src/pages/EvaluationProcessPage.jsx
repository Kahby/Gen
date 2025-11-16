import { Target, PenTool, Sparkles, CheckCircle, TrendingUp } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import InfoCard from '../components/InfoCard';

const EvaluationProcessPage = () => {
  return (
    <PageWrapper>
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Page Indicator */}
          <div className="flex justify-center mb-6">
            <div className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Evaluation Process
            </div>
          </div>

          {/* Main Title */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-2">How We Evaluate</h1>
            <h2 className="text-5xl font-bold text-yellow-400">Your Prompts</h2>
            <p className="text-gray-300 text-lg mt-4 max-w-3xl mx-auto">
              Our advanced AI-powered Prompt Analyzer evaluates submissions across multiple
              dimensions to provide comprehensive feedback and accurate scoring.
            </p>
          </div>

          {/* Info Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard
              icon={Target}
              title="Precision Analysis"
              description="We evaluate how precisely your prompt communicates the intended message. Our AI examines clarity, specificity, and directness of instruction to ensure effective communication."
            />
            <InfoCard
              icon={PenTool}
              title="Design Quality"
              description="The aesthetic and structural design of your prompt is assessed. We look at formatting, organization, and visual appeal of the prompt structure to maximize readability and impact."
            />
            <InfoCard
              icon={Sparkles}
              title="Creativity Score"
              description="Innovation and originality are key. We measure how uniquely your prompt approaches the problem and incorporates creative elements that stand out from conventional approaches."
            />
            <InfoCard
              icon={CheckCircle}
              title="Accuracy Assessment"
              description="We verify that your prompt produces the expected output. Testing includes consistency, reliability, and correctness of results across multiple iterations and scenarios."
            />
            <InfoCard
              icon={TrendingUp}
              title="Overall Performance"
              description="A comprehensive evaluation combining all metrics. We calculate your final score and provide detailed feedback highlighting strengths and areas for improvement."
            />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default EvaluationProcessPage;

