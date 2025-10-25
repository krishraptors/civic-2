import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FileText, MessageSquare, Shield, Users, TrendingUp, CheckCircle } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  const features = [
    {
      icon: FileText,
      title: 'Report Issues',
      description: 'Easily report civic issues with photos and location tracking',
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor the status of your complaints in real-time',
    },
    {
      icon: MessageSquare,
      title: 'AI Assistant',
      description: 'Get instant help from our intelligent chatbot',
    },
    {
      icon: Shield,
      title: 'Transparent',
      description: 'Public dashboard shows all community issues',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Work together to improve your neighborhood',
    },
    {
      icon: CheckCircle,
      title: 'Quick Resolution',
      description: 'Authorities respond and resolve issues efficiently',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-white to-green-600/10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center space-x-2 mb-6">
              <div className="w-3 h-8 bg-orange-500 rounded"></div>
              <div className="w-3 h-8 bg-white border-2 border-gray-300 rounded"></div>
              <div className="w-3 h-8 bg-green-600 rounded"></div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Building Better
              <span className="block bg-gradient-to-r from-orange-600 to-green-600 text-transparent bg-clip-text">
                Communities Together
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Report civic issues, track resolutions, and work with authorities to create a cleaner, safer community for everyone
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition shadow-lg"
                  >
                    Go to Dashboard
                  </Link>
                  <Link
                    to="/public"
                    className="px-8 py-4 border-2 border-orange-500 text-orange-600 rounded-lg font-semibold text-lg hover:bg-orange-50 transition"
                  >
                    View Public Issues
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition shadow-lg"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/public"
                    className="px-8 py-4 border-2 border-orange-500 text-orange-600 rounded-lg font-semibold text-lg hover:bg-orange-50 transition"
                  >
                    View Public Issues
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose CivicConnect?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Empowering citizens and authorities to work together for a better tomorrow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-8 border-t-4 border-orange-500"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-500 to-green-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-orange-50 mb-8">
            Join thousands of citizens working towards cleaner, safer communities
          </p>
          {!user && (
            <Link
              to="/register"
              className="inline-block px-8 py-4 bg-white text-orange-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg"
            >
              Create Your Account
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-green-600 text-transparent bg-clip-text mb-2">
              24/7
            </div>
            <p className="text-gray-600 font-semibold">Support Available</p>
          </div>
          <div>
            <div className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-green-600 text-transparent bg-clip-text mb-2">
              Fast
            </div>
            <p className="text-gray-600 font-semibold">Issue Resolution</p>
          </div>
          <div>
            <div className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-green-600 text-transparent bg-clip-text mb-2">
              100%
            </div>
            <p className="text-gray-600 font-semibold">Transparent Process</p>
          </div>
        </div>
      </div>
    </div>
  );
}
