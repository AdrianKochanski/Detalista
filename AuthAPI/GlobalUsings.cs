global using System.Text;
global using System.ComponentModel.DataAnnotations;
global using System.IdentityModel.Tokens.Jwt;
global using System.Security.Claims;

global using Microsoft.AspNetCore.Mvc;
global using Microsoft.EntityFrameworkCore;
global using Microsoft.AspNetCore.Authorization;
global using Microsoft.AspNetCore.Identity;
global using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
global using Microsoft.IdentityModel.Tokens;

global using AuthAPI.Models;
global using AuthAPI.Models.Dtos;
global using AuthAPI.Helpers;
global using AuthAPI.Authentication;
global using AuthAPI.Identity;
global using AuthAPI.Extensions;

global using AutoMapper;

global using Core.Dtos;
global using Core.Errors;
global using Core.Controllers;
global using Core.Entities.Identity;
global using Core.Extensions;
global using Core.Middleware;
