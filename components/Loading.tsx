import React from "react";
import { motion } from "framer-motion";

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-100 z-50">
      {/* Cloud Icon Animation */}
      <motion.div
        className="w-24 h-24 bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-500 rounded-full shadow-lg"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      ></motion.div>

      {/* Animated Lines as Skeleton */}
      <div className="flex flex-col space-y-4 w-3/4 md:w-1/2 lg:w-1/3">
        {[
          { width: "80%" },
          { width: "95%" },
          { width: "70%" },
          { width: "60%" },
        ].map((line, index) => (
          <motion.div
            key={index}
            className="h-5 bg-gray-300 rounded-md"
            style={{ width: line.width }}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          ></motion.div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
