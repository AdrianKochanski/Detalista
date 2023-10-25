global using System;
global using System.Security.Claims;

global using Microsoft.AspNetCore.Builder;
global using Microsoft.EntityFrameworkCore;
global using Microsoft.AspNetCore.Mvc;
global using Microsoft.Extensions.Configuration;
global using Microsoft.Extensions.DependencyInjection;
global using Microsoft.EntityFrameworkCore.Metadata.Builders;
global using Microsoft.AspNetCore.Authorization;

global using AutoMapper;

global using OrdersAPI.Helpers;
global using OrdersAPI.Data;
global using OrdersAPI.Data.Specifications;
global using OrdersAPI.Services;
global using OrdersAPI.Models.Dtos;

global using Core.Controllers;
global using Core.Errors;
global using Core.Specifications;
global using Core.Interfaces;
global using Core.Entities;
global using Core.Extensions;
global using Core.Middleware;
global using Core.Dtos;
global using Core.Helpers;
global using Core.Entities.Orders;
global using Order = Core.Entities.Orders.Order;
global using Core.Services;
global using Core.Data;