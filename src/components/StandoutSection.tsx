import { CheckCircle } from "lucide-react";
const StandoutSection = () => {
  const features = ["Highly Experienced Mentors (with cultural connectivity)", "Inclusive Student Leadership", "Industry Oriented Training", "Opportunities Coaching", "Best Participants For All"];
  return <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
            Why Builtby.BCA Stands Out ?
          </h2>
          
          {/* Large BCA Logo */}
          <div className="mb-12">
            <div className="text-8xl sm:text-9xl font-black">
              
            </div>
          </div>

          {/* Features List */}
          <div className="max-w-2xl mx-auto space-y-6">
            {features.map((feature, index) => <div key={index} className="flex items-center justify-start space-x-4 p-4 card-glass rounded-lg group hover:scale-105 transition-all duration-300 animate-fade-up" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                <div className="flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-bca-red" />
                </div>
                <span className="text-white font-medium text-left">{feature}</span>
              </div>)}
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-10 right-10 w-24 h-24 bg-bca-red/10 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-bca-red/5 rounded-full blur-xl animate-float" style={{
      animationDelay: "3s"
    }}></div>
    </section>;
};
export default StandoutSection;