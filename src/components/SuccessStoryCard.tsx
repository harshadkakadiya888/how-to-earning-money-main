import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Target, Clock, Quote, TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import React from 'react';

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getStrategyCategory(strategy: string) {
  const categories = {
    'Freelancing': { name: 'Freelancing', color: 'from-blue-500 to-blue-600' },
    'Upwork': { name: 'Freelancing', color: 'from-blue-500 to-blue-600' },
    'Fiverr': { name: 'Freelancing', color: 'from-blue-500 to-blue-600' },
    'Blogging': { name: 'Content Creation', color: 'from-purple-500 to-purple-600' },
    'Content Creation': { name: 'Content Creation', color: 'from-purple-500 to-purple-600' },
    'Digital Products': { name: 'Digital Products', color: 'from-green-500 to-green-600' },
    'Affiliate Marketing': { name: 'Affiliate Marketing', color: 'from-orange-500 to-orange-600' },
    'E-commerce': { name: 'E-commerce', color: 'from-red-500 to-red-600' },
    'Dropshipping': { name: 'E-commerce', color: 'from-red-500 to-red-600' },
    'Investing': { name: 'Investing', color: 'from-yellow-500 to-yellow-600' },
    'Consulting': { name: 'Consulting', color: 'from-indigo-500 to-indigo-600' },
    'Online Courses': { name: 'Education', color: 'from-teal-500 to-teal-600' },
    'Tutoring': { name: 'Education', color: 'from-teal-500 to-teal-600' },
    'Virtual Assistant': { name: 'Services', color: 'from-pink-500 to-pink-600' },
    'Social Media': { name: 'Content Creation', color: 'from-purple-500 to-purple-600' },
    'YouTube': { name: 'Content Creation', color: 'from-purple-500 to-purple-600' },
    'Podcasting': { name: 'Content Creation', color: 'from-purple-500 to-purple-600' }
  };

  for (const [key, category] of Object.entries(categories)) {
    if (strategy.toLowerCase().includes(key.toLowerCase())) {
      return category;
    }
  }
  return { name: 'Other', color: 'from-gray-500 to-gray-600' };
}

const SuccessStoryCard = ({ story }: { story: any }) => {
  const increasePercentage = story.monthlyIncomeBefore > 0
      ? Math.round(((story.monthlyIncomeNow - story.monthlyIncomeBefore) / story.monthlyIncomeBefore) * 100)
      : 0;

  const strategyInfo = getStrategyCategory(story.primaryStrategyUsed);

  return (
      <Card className="group relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 rounded-2xl">
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/30 dark:to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Top accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${strategyInfo.color}`}></div>

        <CardContent className="relative p-8">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              {/* Enhanced Avatar */}
              <div className="relative">
                <div className={`w-16 h-16 bg-gradient-to-br ${strategyInfo.color} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-white font-bold text-xl font-heading">
                  {getInitials(story.fullName)}
                </span>
                </div>
                {/* Success indicator */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-sm">
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white font-heading mb-1">
                  {story.fullName}
                </h3>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(story.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>

            {/* Verified badge */}
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-700 px-3 py-1">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          </div>

          {/* Income Transformation - Hero Section */}
          <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl border border-gray-100 dark:border-gray-700">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">Monthly Income Transformation</p>
              {increasePercentage > 0 && (
                  <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  +{increasePercentage}% Growth
                </span>
                  </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2 uppercase tracking-wide">Before</p>
                <p className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                  {formatCurrency(story.monthlyIncomeBefore)}
                </p>
              </div>
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 border-green-200 dark:border-green-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2 uppercase tracking-wide">After</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(story.monthlyIncomeNow)}
                </p>
              </div>
            </div>
          </div>

          {/* Strategy & Time Badges */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Badge className={`px-4 py-2 text-white bg-gradient-to-r ${strategyInfo.color} border-0 shadow-sm`}>
              <Target className="h-4 w-4 mr-2" />
              {strategyInfo.name}
            </Badge>
            <Badge variant="outline" className="px-4 py-2 border-gray-300 dark:border-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              {story.timeToTransform}
            </Badge>
            <Badge className="px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-700">
              <DollarSign className="h-4 w-4 mr-2" />
              {formatCurrency(story.monthlyIncomeNow)}/mo
            </Badge>
          </div>

          {/* Story Quote */}
          <div className="relative mb-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-l-4 border-blue-500">
            <Quote className="absolute top-4 right-4 h-6 w-6 text-blue-500/30" />
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-body italic pr-8">
              "{story.journey.length > 180 ? `${story.journey.substring(0, 180)}...` : story.journey}"
            </p>
          </div>

          {/* Strategy Details */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 uppercase tracking-wide">
                  Primary Strategy
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white font-heading">
                  {story.primaryStrategyUsed}
                </p>
              </div>

              {/* Success indicator */}
              <div className="flex items-center text-sm text-green-600 dark:text-green-400 font-medium">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Success Story
              </div>
            </div>
          </div>

          {/* Hover effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
        </CardContent>
      </Card>
  );
};

export default SuccessStoryCard;
