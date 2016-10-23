package standalone.model;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.TimerTask;

import dao.Company;
import yahoofinance.Stock;
import yahoofinance.YahooFinance;

public class FetchLatestStockPrices extends TimerTask{
		
	
	public BigDecimal getStockPrice(String companyName){
		
		//http://maven-repository.com/artifact/com.yahoofinance-api/YahooFinanceAPI/1.3.0
		//http://financequotes-api.com/
		BigDecimal price = null;
		try{			
			Stock stock = YahooFinance.get(companyName);
			price = stock.getQuote(true).getPrice();						
			System.out.println(stock.getName()+" : "+price.toPlainString());			
		}
		catch(Exception e){
		  	System.out.println(e.getMessage());			
		}
		finally{
				
		}	
		return price;
	}
	
	public String getCompanyName(String company_code){
		String companyName = "";
		try{
			Stock stock = YahooFinance.get(company_code);
			companyName = stock.getName();
		}
		catch(Exception e){
			System.out.println(e.getMessage());
		}		
		return companyName;
	}
	
	public boolean addSingleStockToDB(String company_code, Timestamp timeStamp, BigDecimal stockPrice){			
		boolean successMessage = false;
		Connection con = MySqlConnection.getConnection();
		try{
			String query ="INSERT INTO `stocks`.`stock_values` (`company_code`, `time_stamp`, `value`) VALUES (?, ?, ?)";
			PreparedStatement pstmt = con.prepareStatement(query);
			pstmt.setString(1, company_code.toUpperCase());
			pstmt.setTimestamp(2, timeStamp);
			pstmt.setBigDecimal(3,stockPrice);
			pstmt.executeUpdate();
			successMessage = true;
		}
		catch(Exception e){
			successMessage = false;
			System.out.println(e.getMessage());		
		}
		finally{
			
		}
		
		return successMessage;
	}
	
	public ArrayList<Company> getCompaniesList(){
		ArrayList<Company> companiesList = new ArrayList<Company>();
		try{
			Connection con = MySqlConnection.getConnection();
			String query = "Select * from stocks.companies";
			PreparedStatement pstmt = con.prepareStatement(query);
			ResultSet rs = pstmt.executeQuery();
			while(rs.next()){
				String company_code = rs.getString("company_code");
				String company_name = rs.getString("company_name");
				companiesList.add(new Company(company_code,company_name));				
			}			
		}
		catch(Exception e){
			System.out.println(e.getMessage());
		}
		finally{
			
		}
			
		return companiesList;
	}
	
	public boolean addStocksToDB(){
		
		boolean successMessage = true;
		ArrayList<Company> companiesList = getCompaniesList();
		
		for(Company currentCompany : companiesList){
		 BigDecimal stockValue = getStockPrice(currentCompany.getCompanyCode());
		 Timestamp timeStamp = new java.sql.Timestamp(new java.util.Date().getTime());
		 boolean message = addSingleStockToDB(currentCompany.getCompanyCode(),timeStamp,stockValue);
		 successMessage = successMessage & message;
		}
				
		return successMessage;
	}
	
	public void run(){
		addStocksToDB();
	}
	
	
	
	
}
