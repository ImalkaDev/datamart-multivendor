export default function ExplorePage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-extrabold mb-4">Explore Datasets</h1>
      <h2 className="text-2xl text-zinc-600 dark:text-zinc-400 mb-8 font-normal">
        Browse our catalog of premium multivendor datasets.
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Datasets list will be populated here */}
        <p>No datasets available right now. Check back later.</p>
      </div>
    </div>
  );
}
