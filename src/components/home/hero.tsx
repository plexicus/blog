import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
export default function HeroMain() {
    return (
        <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
            {/* Hero Section */}
            <section className="pb-36 pt-50 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">Insights & Innovation</h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Discover the latest trends, best practices, and cutting-edge solutions in technology and digital
                        transformation.
                    </p>
                    <Button className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 text-lg">
                        Explore Articles
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </div>
            </section>
        </div>
    )
}