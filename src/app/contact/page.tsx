"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const contactInfo = [
  {
    title: "Email Us",
    description: "Send us an email and we'll respond within 24 hours.",
    contact: "hello@blogapp.com",
    icon: "📧",
  },
  {
    title: "Visit Us",
    description: "Come say hello at our office headquarters.",
    contact: "123 Blog Street, Writer City, WC 12345",
    icon: "📍",
  },
  {
    title: "Call Us",
    description: "Mon-Fri from 8am to 6pm.",
    contact: "+1 (555) 123-4567",
    icon: "📞",
  },
];

const faqItems = [
  {
    question: "How do I start writing on BlogApp?",
    answer:
      "Simply sign up for a free account, complete your profile, and start writing! Our intuitive editor makes it easy to create and publish your first article.",
  },
  {
    question: "Is BlogApp free to use?",
    answer:
      "Yes! BlogApp is completely free for writers and readers. We offer premium features for advanced users who want additional customization options.",
  },
  {
    question: "Can I monetize my content?",
    answer:
      "Absolutely! We support various monetization options including our partner program, sponsored content, and direct reader support features.",
  },
  {
    question: "How do I get more readers?",
    answer:
      "Focus on quality content, engage with the community, use relevant tags, and share your articles on social media. Our algorithm also promotes high-quality content to new readers.",
  },
];

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<ContactFormData>({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Contact form data:", data);
    // Handle form submission here

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      form.reset();
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Get in Touch
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Have a question, suggestion, or just want to say hello?
                We&nbsp;d love to hear from you.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="text-4xl mb-2">{info.icon}</div>
                    <CardTitle className="text-xl">{info.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {info.description}
                    </p>
                    <p className="font-medium text-primary">{info.contact}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact Form */}
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center text-2xl">
                    Send us a Message
                  </CardTitle>
                  <p className="text-center text-muted-foreground">
                    Fill out the form below and we&nbsp;ll get back to you as
                    soon as possible.
                  </p>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-8 space-y-4">
                      <div className="text-6xl">✅</div>
                      <h3 className="text-2xl font-semibold">Message Sent!</h3>
                      <p className="text-muted-foreground">
                        Thank you for reaching out. We&nbsp;ll get back to you
                        within 24 hours.
                      </p>
                      <Badge variant="secondary" className="mt-4">
                        Response time: Usually within 2-4 hours
                      </Badge>
                    </div>
                  ) : (
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            rules={{
                              required: "Name is required",
                              minLength: {
                                value: 2,
                                message: "Name must be at least 2 characters",
                              },
                              maxLength: {
                                value: 50,
                                message: "Name must be less than 50 characters",
                              },
                            }}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your full name"
                                    {...field}
                                    disabled={isSubmitting}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="email"
                            rules={{
                              required: "Email is required",
                              pattern: {
                                value:
                                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Please enter a valid email address",
                              },
                            }}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address *</FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="your.email@example.com"
                                    {...field}
                                    disabled={isSubmitting}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="subject"
                          rules={{
                            required: "Subject is required",
                            minLength: {
                              value: 5,
                              message: "Subject must be at least 5 characters",
                            },
                            maxLength: {
                              value: 100,
                              message:
                                "Subject must be less than 100 characters",
                            },
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="What's this about?"
                                  {...field}
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormDescription>
                                Brief description of your inquiry
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="message"
                          rules={{
                            required: "Message is required",
                            minLength: {
                              value: 10,
                              message: "Message must be at least 10 characters",
                            },
                            maxLength: {
                              value: 1000,
                              message:
                                "Message must be less than 1000 characters",
                            },
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell us more about your inquiry..."
                                  className="min-h-[120px] resize-none"
                                  {...field}
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormDescription>
                                Please provide as much detail as possible to
                                help us assist you better. (
                                {field.value?.length || 0}/1000 characters)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full"
                          size="lg"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Sending Message...
                            </>
                          ) : (
                            "Send Message"
                          )}
                        </Button>

                        <p className="text-xs text-muted-foreground text-center">
                          * Required fields. We&nbsp;ll never share your
                          information with third parties.
                        </p>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-muted-foreground">
                  Quick answers to common questions about BlogApp.
                </p>
              </div>

              <div className="space-y-6">
                {faqItems.map((faq, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg flex items-start gap-3">
                        <span className="text-primary font-bold text-xl">
                          Q:
                        </span>
                        {faq.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-3">
                        <span className="text-primary font-bold text-xl">
                          A:
                        </span>
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-12">
                <p className="text-muted-foreground mb-4">
                  Still have questions? We&nbsp;re here to help!
                </p>
                <Button variant="outline" size="lg">
                  View All FAQs
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Contact Methods */}
        <section className="py-16">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight mb-4">
                  Other Ways to Connect
                </h2>
                <p className="text-muted-foreground">
                  Join our community and stay updated with the latest news.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="text-center">
                  <CardHeader>
                    <div className="text-4xl mb-2">💬</div>
                    <CardTitle>Community Forum</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Join discussions with other writers and get help from the
                      community.
                    </p>
                    <Button variant="outline" className="w-full">
                      Visit Forum
                    </Button>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <div className="text-4xl mb-2">📱</div>
                    <CardTitle>Social Media</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Follow us on social media for updates, tips, and community
                      highlights.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" size="sm">
                        Twitter
                      </Button>
                      <Button variant="outline" size="sm">
                        LinkedIn
                      </Button>
                      <Button variant="outline" size="sm">
                        Discord
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
