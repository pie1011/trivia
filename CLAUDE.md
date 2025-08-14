# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 trivia application bootstrapped with `create-next-app`. The project uses React 19, Bootstrap 5.3.7, and React Bootstrap for styling.

## Development Commands

- **Start development server**: `npm run dev` (uses Turbopack for faster builds)
- **Build for production**: `npm run build`
- **Start production server**: `npm start`
- **Lint code**: `npm run lint`

## Project Structure

- **App Router**: Uses Next.js App Router with the `src/app/` directory structure
- **Styling**: Combines CSS modules (page.module.css) with Bootstrap and custom global styles
- **Fonts**: Uses Geist font family via `next/font/google`
- **Path aliases**: `@/*` maps to `./src/*` (configured in jsconfig.json)

## Key Files

- `src/app/layout.js`: Root layout with global font configuration and Bootstrap CSS import
- `src/app/page.js`: Main homepage component
- `src/app/globals.css`: Global CSS with dark mode support
- `eslint.config.mjs`: ESLint configuration extending Next.js core web vitals

## Architecture Notes

- Uses Next.js App Router (not Pages Router)
- Bootstrap is imported globally in layout.js
- CSS custom properties support dark mode automatically
- Font optimization handled by Next.js font system