import * as React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const skills = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Tailwind CSS",
  "HTML5",
  "CSS3",
  "Node.js",
  "Git",
  "Responsive Design",
];

const experience = [
  {
    title: "Frontend Developer",
    company: "Byldd.com",
    period: "Current Position",
    description:
      "Developing modern web applications using React, Next.js, and TypeScript. Creating responsive user interfaces and optimizing performance for better user experience.",
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Frontend Development",
    company: "Previous Experience",
    period: "5 Years Total",
    description:
      "Built and maintained various web applications, collaborated with design teams, and implemented best practices for scalable frontend architecture.",
    technologies: ["JavaScript", "React", "CSS3", "HTML5"],
  },
];

const achievements = [
  {
    icon: "🚀",
    title: "5+ Years Experience",
    description:
      "Extensive experience in frontend development with modern technologies",
  },
  {
    icon: "💼",
    title: "Professional Developer",
    description: "Currently working as Frontend Developer at Byldd.com",
  },
  {
    icon: "🎯",
    title: "Modern Tech Stack",
    description:
      "Specialized in React, Next.js, TypeScript, and modern CSS frameworks",
  },
  {
    icon: "📱",
    title: "Responsive Design",
    description: "Expert in creating mobile-first, responsive web applications",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="flex flex-col items-center space-y-6">
                {/* Profile Avatar */}
                <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                  <AvatarImage
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
                    alt="Vipin Singh"
                  />
                  <AvatarFallback className="text-2xl font-bold">
                    VS
                  </AvatarFallback>
                </Avatar>

                {/* Introduction */}
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Hi, I&nbsp;m{" "}
                    <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      Vipin Singh
                    </span>
                  </h1>
                  <p className="text-xl md:text-2xl text-muted-foreground">
                    Frontend Developer at{" "}
                    <span className="font-semibold text-primary">
                      Byldd.com
                    </span>
                  </p>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    I have{" "}
                    <span className="font-semibold text-foreground">
                      5 years of experience
                    </span>{" "}
                    building modern, responsive web applications with
                    cutting-edge technologies.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <Link href="/contact">Get in Touch</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/blog">View My Articles</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Me Section */}
        <section className="py-16">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold tracking-tight">
                    About Me
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      As a passionate Frontend Developer with 5 years of
                      experience, I specialize in creating exceptional user
                      experiences through modern web technologies. Currently,
                      I&nbsp;m contributing my skills at Byldd.com, where I work
                      on innovative projects that push the boundaries of web
                      development.
                    </p>
                    <p>
                      My expertise lies in React, Next.js, TypeScript, and
                      modern CSS frameworks. I believe in writing clean,
                      maintainable code and following best practices to deliver
                      high-quality applications that users love.
                    </p>
                    <p>
                      When I&nbsp;m not coding, I enjoy staying up-to-date with
                      the latest web development trends, contributing to
                      open-source projects, and sharing knowledge with the
                      developer community through articles and discussions.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <Card className="p-6">
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-muted-foreground">
                          Available for projects
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium">Experience</span>
                          <span className="text-primary font-semibold">
                            5+ Years
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Current Role</span>
                          <span className="text-primary font-semibold">
                            Frontend Developer
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Company</span>
                          <span className="text-primary font-semibold">
                            Byldd.com
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Specialization</span>
                          <span className="text-primary font-semibold">
                            React & Next.js
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight mb-4">
                  Technical Skills
                </h2>
                <p className="text-muted-foreground">
                  Technologies and tools I work with to create amazing web
                  experiences
                </p>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                {skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-4 py-2 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="py-16">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight mb-4">
                  Professional Experience
                </h2>
                <p className="text-muted-foreground">
                  My journey as a Frontend Developer
                </p>
              </div>

              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <CardTitle className="text-xl">{exp.title}</CardTitle>
                          <p className="text-primary font-semibold">
                            {exp.company}
                          </p>
                        </div>
                        <Badge variant="outline">{exp.period}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {exp.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, techIndex) => (
                          <Badge
                            key={techIndex}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight mb-4">
                  What I Bring
                </h2>
                <p className="text-muted-foreground">
                  Key strengths and expertise I offer
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {achievements.map((achievement, index) => (
                  <Card
                    key={index}
                    className="text-center hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="text-4xl mb-2">{achievement.icon}</div>
                      <CardTitle className="text-lg">
                        {achievement.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {achievement.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="py-16">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">
                Let&nbsp;s Work Together
              </h2>
              <p className="text-muted-foreground">
                I&nbsp;m always interested in discussing new opportunities and
                exciting projects. Feel free to reach out if you&nbsp;d like to
                collaborate or just have a chat about web development.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/contact">Contact Me</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/blog">Read My Blog</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
