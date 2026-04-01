import Link from "next/link";

export default function NotFound() {
    return(
        <>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h1 className="text-6xl font-bold text-red-950 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
            <p className="text-red-900 mb-8 text-center max-w-md">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link
                href="/" 
                className="px-6 py-3 bg-red-900 text-white rounded-lg hover:bg-red-900 transition"
            >
                Go Back Home
            </Link>
        </div>
        </>
    )
}