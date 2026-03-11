# Founder Operating System Master Architecture Document

This document serves as the central brain for the Founder Operating System project. All development agents must read this file thoroughly before modifying the codebase to understand the system architecture, component relationships, and overall product vision.

## Product Vision
An artificial intelligence agentic system that connects to business tools via Model Context Protocol style integrations. It continuously monitors the business and gives founders and employees targeted and actionable recommendations.

## Core Technology Stack
- Framework: Next JS Application Router
- Styling: Tailwind Cascading Style Sheets
- Components: shadcn user interface
- Intelligence: Vercel Artificial Intelligence Software Development Kit

## External Integrations and Tools
The system exposes external data systems as tools that our agents can call. These are implemented as TypeScript interfaces mimicking the Model Context Protocol to prove robust systems engineering capabilities.

- Analytics Tool: Fetches funnel data, retention metrics, and feature usage statistics.
- Sales Tool: Fetches pipeline stages, closed won deals, closed lost deals, and churn data.
- Human Resources Tool: Fetches team structure, employee performance scores, and internal survey results.
- Tasks Tool: Fetches engineering issues from platforms like Jira or GitHub.
- Notifications Tool: Sends automated nudges via email or team messaging platforms.

## Artificial Intelligence Agents
The system utilizes three specialized agents. Each agent has restricted tool access to ensure secure data orchestration and clear separation of concerns.

- Company Health Agent: Uses the Analytics, Sales, and Tasks tools to compute key metrics, detect anomalies, and write the daily founder briefing.
- People Coach Agent: Uses the Human Resources and Analytics tools to identify at risk teams and generate personalized managerial coaching suggestions.
- Nudging Agent: Uses the Notifications tool to turn insights into scheduled communication drafts for human approval.

## User Interface Routes
The frontend is organized into four primary pages accessible via a persistent left sidebar.

- Dashboard: Displays top company health metrics, the daily artificial intelligence briefing, and active system alerts.
- Connections: Manages the connection status of the simulated external tool integrations.
- Teams: Lists employee health indicators and individual coaching suggestions.
- Nudges: Shows a timeline of suggested automated messages with approve and edit actions for human in the loop control.
