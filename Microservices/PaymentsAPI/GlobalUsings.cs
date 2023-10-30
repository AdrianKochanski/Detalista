global using Microsoft.EntityFrameworkCore;
global using Microsoft.AspNetCore.Mvc;
global using Microsoft.AspNetCore.Authorization;

global using Stripe;

global using Core.Models.Errors;
global using Core.Controllers;
global using Core.Extensions;
global using Core.Middleware;
global using Core.Models.Orders;
global using Core.Services;
global using Core.Services.Interfaces;
global using Core.Models.Basket.Dtos;
global using Core.Models.Orders.Dtos;
global using Core.Models.Identity.Dtos;
global using Core.Models.Options;

global using PaymentsAPI.Interfaces;
global using PaymentsAPI.Services;