import Link from "next/link";

interface RestaurantCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  tags: string[];
  deliveryTime: string;
  deliveryFee: string;
  key?: string;
}

export default function RestaurantCard({
  id, name, image, rating, tags, deliveryTime, deliveryFee
}: RestaurantCardProps) {
  return (
    <Link
      href={`/restaurants/${id}`}
      className="group flex flex-col glass-card rounded-3xl overflow-hidden hover:border-brand-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-500/10 hover:-translate-y-1 block"
    >
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        {/* Placeholder image representation via CSS if no external URL is available */}
        <div
          className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

        <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/20 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-yellow-400">
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
          </svg>
          {rating}
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold tracking-tight group-hover:text-brand-400 transition-colors line-clamp-1">{name}</h3>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-1">
          {tags.join(" • ")}
        </p>

        <div className="mt-auto flex items-center justify-between text-sm pt-4 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-brand-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{deliveryTime}</span>
          </div>
          <div className="flex items-center gap-1.5 text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-brand-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
            <span className="font-medium">{deliveryFee}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
