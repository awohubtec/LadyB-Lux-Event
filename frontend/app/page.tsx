import CategoryCard from '@/components/CategoryCard';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <section className="mb-12">
        <h1 className="text-5xl font-bold mb-4">🎉 Plan Your Perfect Event</h1>
        <p className="text-xl text-gray-600 mb-6">
          Connect with the best vendors for cakes, decorations, entertainment, and more!
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <CategoryCard 
            title="Event Planners" 
            icon="📋"
          />
          <CategoryCard 
            title="Decorations & Rentals" 
            icon="🎨"
          />
          <CategoryCard 
            title="Cakes" 
            icon="🍰"
          />
          <CategoryCard 
            title="Small Chops" 
            icon="🍤"
          />
        </div>
      </section>

      <section className="mt-12 bg-blue-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-3xl mb-2">1️⃣</div>
            <p className="font-semibold">Register</p>
            <p className="text-sm text-gray-600">Create your account</p>
          </div>
          <div>
            <div className="text-3xl mb-2">2️⃣</div>
            <p className="font-semibold">Create Event</p>
            <p className="text-sm text-gray-600">Set event date & location</p>
          </div>
          <div>
            <div className="text-3xl mb-2">3️⃣</div>
            <p className="font-semibold">Browse Vendors</p>
            <p className="text-sm text-gray-600">Find & add to cart</p>
          </div>
          <div>
            <div className="text-3xl mb-2">4️⃣</div>
            <p className="font-semibold">Pay & Confirm</p>
            <p className="text-sm text-gray-600">Complete payment</p>
          </div>
        </div>
      </section>
    </div>
  );
}
