import { CheckCircle } from "lucide-react";
const StandoutSection = () => {
  const features = ["Highly Experienced Mentors (with cultural connectivity)", "Inclusive Student Leadership", "Industry Oriented Training", "Opportunities Coaching", "Best Participants For All"];
  return <section className="py-20 relative">
      

      {/* Background decorative elements */}
      <div className="absolute top-10 right-10 w-24 h-24 bg-bca-red/10 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-bca-red/5 rounded-full blur-xl animate-float" style={{
      animationDelay: "3s"
    }}></div>
    </section>;
};
export default StandoutSection;