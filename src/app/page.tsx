'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaUpload, FaComments, FaChartBar, FaRobot } from 'react-icons/fa';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch'))
      .then(setProducts)
      .catch(e => console.error("Fetch error:", e));
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <motion.section className="text-center py-20" {...fadeIn}>
        <h1 className="text-5xl font-bold mb-6">Welcome to CrowdSelect</h1>
        <p className="text-2xl mb-8">Harness the Wisdom of the Crowd for Your Critical Decisions</p>
        <Link href="/submit" className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300">
          Start Your First Campaign
        </Link>
      </motion.section>

      <motion.section className="mb-20" {...fadeIn}>
        <h2 className="text-3xl font-semibold mb-6 text-center">Are You Facing These Challenges?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { title: "Rebranding Decisions", desc: "Uncertain about a new company logo? Get immediate feedback to ensure your design resonates." },
            { title: "Product Launches", desc: "Validate your ideas and gauge consumer sentiment before significant investment." },
            { title: "Advertising Strategies", desc: "Test multiple ad concepts to discover which one truly captures your audience." },
            { title: "Creative Content", desc: "Boost your content's performance by letting users weigh in on designs like YouTube thumbnails." }
          ].map((item, index) => (
            <motion.div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section className="mb-20" {...fadeIn}>
        <h2 className="text-3xl font-semibold mb-6 text-center">How CrowdSelect Works</h2>
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 md:space-x-4">
          {[
            { icon: FaUpload, title: "Upload Content", desc: "Share your ideas or designs" },
            { icon: FaComments, title: "Gather Feedback", desc: "Collect insights from diverse audiences" },
            { icon: FaChartBar, title: "Analyze Results", desc: "View comprehensive feedback summaries" },
            { icon: FaRobot, title: "AI-Powered Insights", desc: "Get deep analysis from our in-house LLM" }
          ].map((step, index) => (
            <motion.div key={index} className="flex flex-col items-center text-center" whileHover={{ y: -5 }}>
              <step.icon className="text-4xl mb-2 text-blue-500" />
              <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
              <p className="text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section {...fadeIn}>
        <h2 className="text-3xl font-semibold mb-6 text-center">Recent Campaigns</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {products.slice(0, 4).map((product: any) => (
            <motion.div key={product._id} className="bg-gray-800 p-6 rounded-lg shadow-lg" whileHover={{ scale: 1.03 }}>
              <h3 className="text-2xl font-bold mb-2">{product.title}</h3>
              <p className="mb-4">{product.description.substring(0, 100)}...</p>
              <div className="flex space-x-4">
                <Link href={`/vote/${product._id}`} className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300">
                  Vote
                </Link>
                <Link href={`/results/${product._id}`} className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300">
                  View Results
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section className="text-center py-20" {...fadeIn}>
        <h2 className="text-3xl font-semibold mb-4">Ready to Make Informed Decisions?</h2>
        <p className="text-xl mb-8">Join CrowdSelect today and leverage collective intelligence for your projects.</p>
        <Link href="/register" className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300">
          Sign Up Now
        </Link>
      </motion.section>
    </div>
  );
}