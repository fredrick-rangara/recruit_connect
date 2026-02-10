import React from 'react';
import { Star } from 'lucide-react';

const TestimonialCard = ({ name, role, quote, rating }) => (
  <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex gap-1 mb-4">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} size={18} className="fill-orange-400 text-orange-400" />
      ))}
    </div>
    <p className="text-slate-600 italic mb-6">"{quote}"</p>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden">
        {/* Placeholder for avatar */}
        <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
          {name[0]}
        </div>
      </div>
      <div>
        <h4 className="font-bold text-slate-900">{name}</h4>
        <p className="text-sm text-slate-500">{role}</p>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  const reviews = [
    { name: "Sarah Jenkins", role: "Software Engineer", quote: "RecruitConnect helped me land my dream job at Google. The process was seamless!", rating: 5 },
    { name: "Marcus Chen", role: "UI/UX Designer", quote: "The best job platform I've used. The interface is intuitive and the job matches are spot on.", rating: 5 },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {reviews.map((rev, i) => <TestimonialCard key={i} {...rev} />)}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;