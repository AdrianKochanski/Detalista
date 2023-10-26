global using System;
global using System.IO;
global using System.Text.Json;
global using System.Reflection;

global using Microsoft.AspNetCore.Builder;
global using Microsoft.EntityFrameworkCore;
global using Microsoft.AspNetCore.Mvc;
global using Microsoft.Extensions.Configuration;
global using Microsoft.Extensions.DependencyInjection;
global using Microsoft.Extensions.Logging;
global using Microsoft.EntityFrameworkCore.Metadata.Builders;
global using Microsoft.Extensions.FileProviders;

global using AutoMapper;

global using ProductsAPI.Helpers;
global using ProductsAPI.Data;
global using ProductsAPI.Interfaces;
global using ProductsAPI.Data.Specifications;

global using Core.Controllers;
global using Core.Models.Errors;
global using Core.Data.Specifications;
global using Core.Data.Interfaces;
global using Core.Models;
global using Core.Models.Seed;
global using Core.Extensions;
global using Core.Middleware;
global using Core.Models.Dtos;
global using Core.Helpers;
global using Core.Data;