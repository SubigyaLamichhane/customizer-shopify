import {Page, Pagination, Grid,Thumbnail,Button, LegacyCard} from '@shopify/polaris';
import {useNavigate} from "react-router-dom";
import {IndexTable,Text} from '@shopify/polaris';
import React from 'react';
import { TitleBar } from "@shopify/app-bridge-react";
export default function CustomDesign() {
   const orders = [
      {
        id: '1020',
        title: 'Product 1',
        ImgUrl:'https://cdn.shopify.com/s/files/1/0549/7988/7190/files/trustpilot-svgrepo-com.png?v=1681199595',
      },
      {
         id: '1021',
         title: 'Product 2',
         ImgUrl:'https://cdn.shopify.com/s/files/1/0549/7988/7190/files/trustpilot-svgrepo-com.png?v=1681199595',
       },
       {
         id: '1023',
         title: 'Product 3',
         ImgUrl:'https://cdn.shopify.com/s/files/1/0549/7988/7190/files/trustpilot-svgrepo-com.png?v=1681199595',
       },
    ];
   
    const navigate = useNavigate();
    const resourceName = {
      singular: 'order',
      plural: 'orders',
    };
  
    const rowMarkup = orders.map(
      (
        {id, title,ImgUrl},
        index,
      ) => (
        <IndexTable.Row id={id} key={id} position={index}>
          <IndexTable.Cell>
          <Grid>
          <Grid.Cell  alignment="center">
          <Thumbnail
      source={ImgUrl}
     
      alt="Product Img"
    /></Grid.Cell>
          <Grid.Cell >

            <Text variant="bodyMd" fontWeight="bold" as="span">
              {title}
            </Text>
            </Grid.Cell>
            </Grid>
          </IndexTable.Cell>
          <IndexTable.Cell><Button primary id={id} onClick={()=>navigate("/ProductMap")}>Mapping</Button></IndexTable.Cell>
         
        </IndexTable.Row>
      ),
    );
     return(
        <>
        
          <Page>
          <TitleBar
        title="Custom Design App"
        primaryAction={{
          content: "New Product",
          onAction: () => console.log("Primary action"),
        }}
      />
       <LegacyCard>
      <IndexTable
        resourceName={resourceName}
        itemCount={orders.length}
        headings={[
          {title: 'Product',alignment: 'center'},
          {title: 'Map',alignment: 'center'},
          
        ]}
        selectable={false}
      >
        {rowMarkup}
      </IndexTable>
   
    </LegacyCard>
    <div className="mt-2">
    <Pagination
      hasPrevious
      onPrevious={() => {
        console.log('Previous');
      }}
      hasNext
      onNext={() => {
        console.log('Next');
      }}
    /></div>
          </Page>
        </>
     )
 
}