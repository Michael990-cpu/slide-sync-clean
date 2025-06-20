import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Crown } from "lucide-react"
import Link from "next/link"

export default function PremiumPage() {
  const features = [
    "Remove watermark from all exports",
    "Access to all premium transitions (Zoom, Spin, etc.)",
    "1080p Full HD video export",
    "Full music library access",
    "Unlimited slideshows",
    "Priority customer support",
    "Advanced text styling options",
    "Custom branding options",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="bg-primary text-primary-foreground w-8 h-8 rounded-md flex items-center justify-center">
              S
            </div>
            <span>SlideSync</span>
          </Link>
          <Link href="/create">
            <Button variant="outline">Back to Editor</Button>
          </Link>
        </div>
      </header>

      <main className="container py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Go Premium</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock all features and create professional slideshows without limitations
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="text-4xl font-bold">$0</div>
              <p className="text-muted-foreground">Forever free</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  Basic transitions (Fade, Slide)
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  720p video export
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  Limited music library
                </li>
                <li className="flex items-center text-muted-foreground">
                  <span className="mr-2 h-4 w-4 flex items-center justify-center">×</span>
                  Watermark on exports
                </li>
              </ul>
              <Link href="/create">
                <Button variant="outline" className="w-full">
                  Continue with Free
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="relative border-primary">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
              Recommended
            </div>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                Premium
                <Crown className="h-5 w-5 text-primary" />
              </CardTitle>
              <CardDescription>For serious creators</CardDescription>
              <div className="text-4xl font-bold">$9.99</div>
              <p className="text-muted-foreground">per month</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full" size="lg">
                Upgrade to Premium
              </Button>
              <p className="text-xs text-center text-muted-foreground">Cancel anytime. 7-day free trial included.</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-2">Can I cancel my subscription anytime?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes, you can cancel your subscription at any time. You'll continue to have access to premium features
                  until the end of your billing period.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-2">What happens to my slideshows if I downgrade?</h3>
                <p className="text-muted-foreground text-sm">
                  Your existing slideshows will remain accessible, but new exports will include watermarks and be
                  limited to 720p resolution.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-2">Do you offer refunds?</h3>
                <p className="text-muted-foreground text-sm">
                  We offer a 7-day free trial and a 30-day money-back guarantee if you're not satisfied with our premium
                  features.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
