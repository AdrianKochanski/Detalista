using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using AutoMapper;
using Core.Entities.OrderAggregate;
using Microsoft.Extensions.Configuration;

namespace API.Helpers
{
    public class OrderItemUrlResolver : IValueResolver<OrderItem, OrderItemDto, string>
    {
        private readonly IConfiguration _configuration;

            public OrderItemUrlResolver(IConfiguration configuration)
        {
            this._configuration = configuration;
        }

        public string Resolve(OrderItem source, OrderItemDto destination, string destMember, ResolutionContext context)
        {
            if(string.IsNullOrEmpty(source.ItemOrdered.PictureUrl)) 
            {
                return _configuration["ApiUrl"] + source.ItemOrdered.PictureUrl;
            }

            return null;
        }
    }
}